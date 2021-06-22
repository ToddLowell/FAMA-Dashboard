# FAMA Dashboard

## Dev Setup

```bash
# install dependencies
$ npm install

# serve Nuxt app with hot reload at localhost:3000
$ npm run dev

# serve standalone Express app in /api with hot reload at localhost:4000
$ npm run dev:express
```

## Production Build Setup

```bash
# install dependencies
$ npm install

# build and optimize your application with webpack
$ npm run build

# launch server
$ npm run start

# or launch server in the background
$ npm run pm2:start
```

---

## CSV GroupBy in JavaScript

### Source CSV

State  | Month | Quantity
:----: | :---: | :------:
Johor  | Jan   | 240
Johor  | Feb   | 260
Johor  | Feb   | 300
Penang | Jan   | 200

### JavaScript Code

```js
const data = [
  {
    State: "Johor",
    Month: "Jan",
    Quantity: 240
  },
  {
    State: "Johor",
    Month: "Feb",
    Quantity: 260
  },
  {
    State: "Johor",
    Month: "Feb",
    Quantity: 300
  },
  {
    State: "Penang",
    Month: "Jan",
    Quantity: 200
  }
];

const formattedData = data.reduce((result, { State, Month, Quantity }) => {
  // init empty object if not there
  result[State] = result[State] || {};
  // init empty object if not there
  result[State][Month] = result[State][Month] || {};
  // init zero if not there
  result[State][Month].Quantity =
    Quantity + (result[State][Month].Quantity || 0);

  return result;
}, {});
```

### Formatted Data Output

```json
{
  "Johor": {
    "Jan": {
      "Quantity": 240
    },
    "Feb": {
      "Quantity": 560
    }
  },
  "Penang": {
    "Jan": {
      "Quantity": 200
    }
  }
}
```
