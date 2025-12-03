import { db, auth } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const DAILY_LIMIT_GUEST = 3;
const DAILY_LIMIT_REGISTERED = 10;

export const checkAndIncrementUsage = async (): Promise<{ allowed: boolean; reason?: 'limit_reached' | 'error' }> => {
    try {
        const user = auth.currentUser;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        let docId = '';
        let limit = DAILY_LIMIT_GUEST;

        if (user) {
            docId = user.uid;

            // Check if user is premium
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().isPremium) {
                return { allowed: true }; // Unlimited for premium
            }

            limit = DAILY_LIMIT_REGISTERED;
        } else {
            // Anonymous / Guest
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem('device_id', deviceId);
            }
            docId = 'anon_' + deviceId;
        }

        const usageRef = doc(db, 'daily_usage', `${docId}_${today}`);
        const usageSnap = await getDoc(usageRef);

        if (usageSnap.exists()) {
            const data = usageSnap.data();
            if (data.count >= limit) {
                return { allowed: false, reason: 'limit_reached' };
            }
            await updateDoc(usageRef, {
                count: increment(1),
                lastUsed: serverTimestamp()
            });
        } else {
            await setDoc(usageRef, {
                count: 1,
                date: today,
                userId: user ? user.uid : null,
                deviceId: user ? null : docId,
                lastUsed: serverTimestamp()
            });
        }

        return { allowed: true };
    } catch (error) {
        console.error("Error checking usage limits:", error);
        // In case of error (e.g. network), we might want to allow or block. 
        // Allowing for now to avoid blocking users due to technical faults.
        return { allowed: true };
    }
};

export const getRemainingUsage = async (): Promise<number> => {
    try {
        const user = auth.currentUser;
        const today = new Date().toISOString().split('T')[0];

        let docId = '';
        let limit = DAILY_LIMIT_GUEST;

        if (user) {
            docId = user.uid;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().isPremium) {
                return -1; // Unlimited
            }
            limit = DAILY_LIMIT_REGISTERED;
        } else {
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) return DAILY_LIMIT_GUEST;
            docId = 'anon_' + deviceId;
        }

        const usageRef = doc(db, 'daily_usage', `${docId}_${today}`);
        const usageSnap = await getDoc(usageRef);

        if (usageSnap.exists()) {
            const count = usageSnap.data().count;
            return Math.max(0, limit - count);
        }

        return limit;
    } catch (error) {
        return 0;
    }
};
