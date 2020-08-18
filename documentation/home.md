# Overview

This documentation treats admin user interface Home page. The module is able to retrieve 3 essential information :

* Network
* Current connection
* WLAN information

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/home.png?raw=true" alt="Home page"/>
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
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/strength.png?raw=true" alt="Strength"/>
</p>

* **Signal max strength**

```js
const maxStrength = network.signal.total;
```

In the following screenshot, max strengh value will be `5`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/strength.png?raw=true" alt="Max strength"/>
</p>

* **Phone operator**

```js
const phoneOperator = network.operator
```
In the following screenshot, phone operator value will be `TELMA`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/telma.png?raw=true" alt="Telma"/>
</p>

* **Network type**

```js
const networkType = network.type;
```

In the following screenshot, metwork type value will be `4G`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/4g.png?raw=true" alt="4G"/>
</p>

Network type can take one of value :

```
2G
3G
4G
```

**NB** : An exception will be thrown if it cannot figure out it.

* **Network status**

```js
const networkStatus = network.status;
```

Network status is an enumeration which is defined by :

```ts
// src/model/NetworkStatus.ts

enum NetworkStatus {
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
    DISCONNECTING,
    STATISTIC_TRAFFIC_EXCEEDED_LIMITED
}
```

**NB** : Because it is a TypeScript, after compilation each value of enum will be converted to number. So to work effectively, follow the code style below :

```js
const { NetworkStatus } = require('huawei-wingle-4g/lib/src/model/home/NetworkStatus');

//Some code

const networkStatus = network.status;
switch (networkStatus) {
    case NetworkStatus.CONNECTED:
        //Do something
        break;
    case NetworkStatus.CONNECTING:
        //Do something
        break;
    case NetworkStatus.DISCONNECTING:
        //Do something
        break;
    case NetworkStatus.DISCONNECTED:
        //Do something;
        break;
    }
```

In the following screenshot, network status will be equals to `NetworkStatus.CONNECTED`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/connected.png?raw=true" alt="Connected"/>
</p>

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
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/duration.png?raw=true" alt="Duration"/>
</p>

**NB** : Duration unit is millisecond.

* **Received data**

```js
const receivedData = currentConnection.received;
```

In the following screenshot, received data will be `28 206 694` byte.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/received.png?raw=true" alt="Received data"/>
</p>

**NB** : Received data unit is byte

* **Sent data**

```js
const sentData = currentConnection.sent;
```
In the following screenshot, send data will be `5 431 623` byte.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/sent.png?raw=true" alt="Sent data"/>
</p>

**NB** : Sent data unit is byte

# Get WLAN information

```js
const wlanInformation = await home.getWlanInformation();
```

It contains theses information :

* **WLAN status**

```js
const wlanStatus = wlanInformation.status;
```

Wlan status is an enumeration which is defined by :

```ts
// src/model/WlanStatus.ts

export enum WlanStatus {
    ON,
    OFF
};
```

**NB** : Because it is a TypeScript, after compilation each value of enum will be converted to number. So to work effectively, follow the code style below :

```js
const { WlanStatus } = require('huawei-wingle-4g/lib/src/model/home/WlanStatus');

//Some code

const wlanStatus = wlanInformation.status;
switch (wlanStatus) {
    case WlanStatus.ON:
        //Do something
        break;
    case WlanStatus.ON:
        //Do something
        break;
    }
```

In the following screenshot, wlan status will be equals to `WlanStatus.ON`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/on.png?raw=true" alt="On"/>
</p>

* **Users count**

```js
const users = wlanInformation.users;
```

In the following screenshot, users count will be `0`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/no-user.png?raw=true" alt="On"/>
</p>

# Connect or disconnect data mobile

It's the equivalent of clicking data mobile button.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home/disable-mobile-data.png?raw=true" alt="Disble mobile dat"/>
</p>

If you want to connect data mobile :

```js
await home.connectDataMobile();
```

**NB** : If data mobile is already connected and you attempt to connect data mobile, it skips process.

else if you want to disconnect data mobile :

```js
await home.disconnectDataMobile();
```

**NB** : If data mobile is already disconnected and you attempt to disconnect data mobile, it skips process.
