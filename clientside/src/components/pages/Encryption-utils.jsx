export class E2EEncryption {
    constructor() {
      this.keyPair = null;
      this.publicKey = null;
      this.privateKey = null;
    }
  
    // Generate key pair for a user
    async generateKeyPair() {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      this.publicKey = this.keyPair.publicKey;
      this.privateKey = this.keyPair.privateKey;
      
      return {
        publicKey: await this.exportKey(this.publicKey),
        privateKey: await this.exportKey(this.privateKey)
      };
    }
  
    // Export key to string format
    async exportKey(key) {
      const exported = await window.crypto.subtle.exportKey(
        "jwk",
        key
      );
      return JSON.stringify(exported);
    }
  
    // Import key from string format
    async importKey(keyStr, type) {
      const keyData = JSON.parse(keyStr);
      return await window.crypto.subtle.importKey(
        "jwk",
        keyData,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        [type]
      );
    }
  
    // Encrypt message using recipient's public key
    async encryptMessage(message, recipientPublicKey) {
      const importedPublicKey = await this.importKey(recipientPublicKey, "encrypt");
      const encodedMessage = new TextEncoder().encode(message);
      
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        importedPublicKey,
        encodedMessage
      );
  
      return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    }
  
    // Decrypt message using own private key
    async decryptMessage(encryptedMessage, privateKey) {
      const importedPrivateKey = await this.importKey(privateKey, "decrypt");
      const encryptedData = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
      
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        importedPrivateKey,
        encryptedData
      );
  
      return new TextDecoder().decode(decryptedData);
    }
  }