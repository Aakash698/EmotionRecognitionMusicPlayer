
import webpush from 'web-push'
var vapidPublicKey = webpush.generateVAPIDKeys().publicKey;
export default function swDev(){
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
       
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
       
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
        var convertedVapidKey =  urlBase64ToUint8Array(vapidPublicKey)

        
    let swURL = `${process.env.PUBLIC_URL}/sw.js`
navigator.serviceWorker.register(swURL).then(async response=>{
   
    return response.pushManager.getSubscription().then(subscription=>{
                return response.pushManager.subscribe({
            userVisibleOnly:true,
            applicationServerKey:convertedVapidKey
        })
       })
})
.catch(err=>console.error(err))
}
