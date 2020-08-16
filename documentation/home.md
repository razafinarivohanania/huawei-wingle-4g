# Overview

This documentation treats admin user interface Home page. The module is able to retrieve 3 essential information :

* Network
* Current connection
* WLAN status

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/home.png?raw=true" alt="Pages"/>
</p>

# Import Home

```js
const { HuaweiWingle4G } = require('huawei-wingle-4g');

const home = huaweiWingle4G.getHome();
//Use home for rest of code
```

# Get Network information

```js
const network = await home.getNetwork();
```

Network contains theses informations :

* Signal strength

```js
const strength = network.signal.strength;
```

In the following screenshot, strengh value will be `1`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/strength.png?raw=true" alt="Pages"/>
</p>

* Signal max strength

```js
const maxStrength = network.signal.total;
```

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/strength.png?raw=true" alt="Pages"/>
</p>

* Phone operator

```js
const phoneOperator = network.operator
```
In the following screenshot, phone operator value will be `TELMA`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/telma.png?raw=true" alt="Pages"/>
</p>

* Network type

```js
const networkType = network.type;
```

In the following screenshot, metwork type value will be `4G`.

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/4g.png?raw=true" alt="Pages"/>
</p>

Network type can take one of value :

```
2G
3G
4G
```

* Network state

```js
const networkState = network.state;
```

Network state is an enumeration where definition is :

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

*NB* : Because it is a TypeScript, after compilation each value of enum will be converted to number. So to work effectively, follow the code style below :

```js
const networkState = network.state;

```

TODO