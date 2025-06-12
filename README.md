para correr el back es
```bash
npm run start
```

para correr el front es
```bash
npm run dev
```
divertite

btw para usar cypress tira
```bash
npx cypress open
```
tambien esta
```bash
npx cypress run
```
pero es mejor el open


para correrlo en mobile tirate un
```bash
npm run build
npx cap sync
npx cap open android
```

eso te buildea el proyecto, te synquea el build en android y desp te lo abre en android studio

para corre appium tira:

```bash
npm run build 
npx cap sync
npm run android
appium
npx wdio run .\wdio.conf.ts
```
