# Overview

This documentation treats admin user interface Home page. The module is able to retrieve 3 essential information :

* Network
* Current connection
* WLAN status

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home.png?raw=true" alt="Home page"/>
</p>

# Import Home

```js
const { HuaweiWingle4G } = require('huawei-wingle-4g');

const username = 'your username on admin user interface';
const password = 'your password on admin user interface';

const huaweiWingle4G = new HuaweiWingle4G(username, password);
const home = huaweiWingle4G.getHome();
//Use home for rest of code
```

# Get Network information

```js
const network = await home.getNetwork();
```

Network contains theses informations :

* **Signal strength**

```js
const strength = network.signal.strength;
```

In the following screenshot, strengh value will be `1`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/strength.png?raw=true" alt="Strength"/>
</p>

* **Signal max strength**

```js
const maxStrength = network.signal.total;
```

In the following screenshot, max strengh value will be `5`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/strength.png?raw=true" alt="Max strength"/>
</p>

* **Phone operator**

```js
const phoneOperator = network.operator
```
In the following screenshot, phone operator value will be `TELMA`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/telma.png?raw=true" alt="Telma"/>
</p>

* **Network type**

```js
const networkType = network.type;
```

In the following screenshot, metwork type value will be `4G`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/4g.png?raw=true" alt="4G"/>
</p>

Network type can take one of value :

```
2G
3G
4G
```

**NB** : An exception will be thrown if it cannot figure out it.

* **Network state**

```js
const networkState = network.state;
```

Network state is an enumeration which is defined by :

```ts
enum State {
    ON,
    OFF,
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
    DISCONNECTING,
    STATISTIC_TRAFFIC_EXCEEDED_LIMITED
}
```

**NB** : Because it is a TypeScript, after compilation each value of enum will be converted to number. So to work effectively, follow the code style below :

```js
const { State } = require('huawei-wingle-4g/lib/src/model/home/State');

//Some code

const networkState = network.state;
switch (networkState) {
    case State.CONNECTED:
        //Do something
        break;
    case State.CONNECTING:
        //Do something
        break;
    case State.DISCONNECTING:
        //Do something
        break;
    case State.DISCONNECTED:
        //Do something;
        break;
    }
```

**NB** : As we can see `ON` and `OFF` value is not handled. Indeed, theses two states never appears for network state.

# Get current connection information

```js
const currentConnection = await home.getCurrentConnection();
```

Current connection contains theses informations :

* **Duration**

```js
const duration = currentConnection.duration;
```

In the following screenshot, duration will be `5810000` ms.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/duration.png?raw=true" alt="Duration"/>
</p>

**NB** : Duration unit is millisecond.

* **Received data**

```js
const receivedData = currentConnection.received;
```

In the following screenshot, received data will be `28 206 694` byte.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/received.png?raw=true" alt="Received data"/>
</p>

**NB** : Received data unit is byte

* **Sent data**

```js
const sentData = currentConnection.sent;
```
In the following screenshot, send data will be `5 431 623` byte.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/sent.png?raw=true" alt="Received data"/>
</p>

**NB** : Sent data unit is byte

# Get WLAN status

TODO