export function uint8ArrayToBase64(bytes: Uint8Array): string {
   let binary = '';
   bytes.forEach((b) => (binary += String.fromCharCode(b)));
   return btoa(binary);
}
