import * as express from 'express';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
    collection,
    addDoc,
    getDocs,
    getFirestore,
    Firestore,
} from 'firebase/firestore';
import { Logger } from '../logger/logger';

class Firebase {
    public router: express.Router;
    public logger: Logger;

    public firebaseApp: FirebaseApp;
    public firestoreDb: Firestore;

    constructor() {
        this.router = express.Router();
        this.logger = new Logger();
        this.initFirebase();
        this.routes();
    }

    // TODO: Extract this out of routes. Doesn't really belong here.
    private initFirebase(): void {
        this.logger.info('Initting firebase');
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_CONFIG_API_KEY,
            authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
            storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_CONFIG_APP_ID,
            measurementId: process.env.FIREBASE_CONFIG_MEASUREMENT_ID,
        };

        this.firebaseApp = initializeApp(firebaseConfig);
        this.firestoreDb = getFirestore(this.firebaseApp);
    }

    private routes(): void {
        // request to get all documents
        this.router.get('/', async (req, res) => {
            const response: any = {};
            const querySnapshot = await getDocs(
                collection(this.firestoreDb, 'transactions')
            );
            querySnapshot.forEach((doc) => {
                response[doc.id] = doc.data();
            });
            res.json(response);
        });

        // request to post a document
        this.router.post('/', async (req, res) => {
            const docRef = await addDoc(
                collection(this.firestoreDb, 'transactions'),
                req.body
            );
            console.log('Document written with ID: ', docRef.id);
            res.json(req.body);
        });
    }
}

export default new Firebase().router;
