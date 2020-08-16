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