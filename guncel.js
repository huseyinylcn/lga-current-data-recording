const admin = require('firebase-admin')
const express = require('express')
const fs = require('fs')
const hostname = '127.0.1.1'
const path = require('path')
const app = express()
const port = 3004;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

var serviceAccount = require("./aglsistem-71590-firebase-adminsdk-olxun-a9589dc058.json");

admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://aglsistem-71590-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

function firebaseicin() {
     const now = new Date();
     const year = now.getFullYear();
     let month = now.getMonth() + 1;
     let day = now.getDate();
     if (month < 10) {
          month = "0" + month;
     }
     if (day < 10) {
          day = "0" + day;
     }
     const filenamedoc = `${year}-${month}-${day}`
     return filenamedoc

}

function dosyaicin() {
     const now = new Date();
     const year = now.getFullYear();
     let month = now.getMonth() + 1;
     let day = now.getDate();
     if (month < 10) {
          month = "0" + month;
     }
     if (day < 10) {
          day = "0" + day;
     }
     const filename = `${year}${month}${day}`
     const dosyaYolu = `${filename}`;
     return dosyaYolu
}
 // mainwindow.webContents.send('tod', `En son Dosya yolu ${date()}`)
async function getUsers() {
     const usersRef = db.collection('dosya_yolu_ist');
     const snapshot = await usersRef.get()

     snapshot.forEach(doc => {
          let pathyol = doc.data().patht
          let istasayanfirstname = doc.data().isim
          let dosyaname = doc.data().dosyaname



          fs.watch(pathyol, () => {
               const dosyalar = fs.readdirSync(pathyol)
                    let lines = []
                     var x = 40;
                    dosyalar.sort().reverse();
                    
                    let yenidosyayolu = `${pathyol}\\${dosyaicin()}${dosyaname}`
                    console.log(yenidosyayolu)
                    const okuyucu = fs.createReadStream(yenidosyayolu, { start: dosyaboyut })

                    okuyucu.on('data', (e) => {

                          lines = e.toString().split('\n')

                          for (let i = 0; i < lines.length; i++) {
                              var forEachveri = lines[i].replace(/\r/g, '')
                              if (forEachveri != '') {
                                    if(i==x){
                                        x += 40;
                                   let date = forEachveri.slice(0, 8)
                                   let veri = forEachveri.slice(11, 18)
                                   let newveri = parseInt(veri, 10)

                                   const Date = date.replace(/:/g, '-')

                                   let datefirebase = `${firebaseicin()}-${Date}`


                                   db.collection(istasayanfirstname).doc(datefirebase)
                                        .set({
                                             propverisi: newveri,
                                             gelenzaman: datefirebase
                                        }
                                        )
                                        .then(() => {
                                             console.log('Veri gönderiliyor');
                                        })
                                   }
                              }
                         }

                    })
                    okuyucu.on('end', () => {
                         dosyaboyut += okuyucu.bytesRead

                    })
          })

          let dosyaboyut = fs.statSync(`${pathyol}\\${dosyaicin()}${dosyaname}`).size
     });


}

getUsers()


app.post('/', (req, res) => {
     const pathh = req.body.dosyayolu2
     const IstasyonName = req.body.istasyonName
     const dosyaname = req.body.uzantı

   
     console.log(IstasyonName)
   
     db.collection('dosya_yolu_ist').doc(IstasyonName)
       .set({
         patht: pathh,
         isim: IstasyonName,
         dosyaname:dosyaname
   
       }
       )
       .then(() => {
         console.log('Veri gönderiliyor');
       })
   
   })
   



app.get('/', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port, () => {
     console.log(`server çalışıyor , http://${hostname}:${port}/`)
})