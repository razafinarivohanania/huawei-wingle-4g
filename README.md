# Overview

This is a module NodeJS allowing to drive Huawei Wingle 4G. This module can :

* get connection state
* enable or disable mobile data
* send/read/remove SMS or store it in draft
* send/reply USSD code and get response

# Conception

This module is oriented to follow admin user interface. It treats 4 essential pages :

* Home
* Statistics
* SMS
* Check services

<p align="center">
    <img src="https://github.com/razafinarivohanania/huawei-wingle-4g/raw/master/screenshot/pages.png?raw=true" alt="Pages"/>
</p>

# Get started

First thing is to install the module from :

```sh
npm install huawei-wingle-4g
```

Import class HuaweiWingle4G like :

```js
const { HuaweiWingle4G } = require('huawei-wingle-4g');
```

Create an instance of HuaweiWingle4G :

```js
const username = 'your username on admin user interface';
const password = 'your password on admin user interface';

const huaweiWingle4G = new HuaweiWingle4G(username, password);
```

Let's get network information. In this case, we will use Home found in HuaweiWingle4G.

```js
const home = huaweiWingle4G.getHome();
const network = await home.getNetwork();
console.log(network);
```

This will print something like this:

```
{
  type: '4G',
  operator: 'TELMA',
  signal: { strength: 1, total: 5 },
  state: 3
}
```

# State

It's in progress ...