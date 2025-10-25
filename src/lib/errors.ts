export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `Firestore Permission Denied: Insufficient permissions for ${context.operation} operation on path: ${context.path}.`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;

        // This is to ensure the prototype chain is correctly set up for extending native Error class
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }
}
