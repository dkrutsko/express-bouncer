# Express Bouncer
[![NPM version](https://badge.fury.io/js/express-bouncer.png)](https://badge.fury.io/js/express-bouncer)

<p align="justify">A simple and standalone middleware for <a href="https://github.com/visionmedia/express">express</a> routes which attempts to mitigate brute-force attacks. It works by increasing the delay with each failed request using a Fibonacci formula. Requests are tracking via IP address and can be white-listed or reset on demand. All logged addresses are stored locally in an object and dormant addresses are removed automatically. Error messages are also completely customizable. This project is based on <a href="https://github.com/AdamPflug/express-brute">express-brute</a> created by <a href="https://github.com/AdamPflug">Adam Pflug</a>.</p>

### Installation
```shell
$ npm install express-bouncer
```

### Quick Start
```js
// Creates a new instance of our bouncer (args optional)
var bouncer = require ("express-bouncer")(500, 900000);

// Add white-listed addresses (optional)
bouncer.whitelist.push ("127.0.0.1");

// In case we want to supply our own error (optional)
bouncer.blocked = function (req, res, next, remaining)
{
	res.send (429, "Too many requests have been made, " +
		"please wait " + remaining / 1000 + " seconds");
};

// Route we wish to protect with bouncer middleware
app.post ("/login", bouncer.block, function (req, res)
{
	if (LoginFailed)
	{
		// Login failed
	}

	else
	{
		bouncer.reset (req);
		// Login succeeded
	}
});

// Clear all logged addresses
// (Usually never really used)
bouncer.addresses = { };
```

### Documentation
#### Constructor
```js
express-bouncer ([min], [max], [free])
```
* **min** The minimum number of milliseconds the user can be forced to wait. *(default: 500 ms)*
* **max** The maximum number of milliseconds the user can be forced to wait. *(default: 10 min)*
* **free** The number of attempts a user can make before being forced to wait. *(default: 2)*

#### Functions
* **reset** Resets the wait time between attempts for the specified request.
* **block** Middleware that will block requests which are occurring too often.

#### Properties
* **addresses** A list of logged IP addresses. Cleared by overriding with new object.
* **whitelist** A list of white-listed IP addresses. These addresses will never be blocked.
* **blocked** Function to be called when a request has been blocked. *(see quick start)*

### Author
* Email: <dave@krutsko.net>
* Home: [dave.krutsko.net](http://dave.krutsko.net)
* GitHub: [github.com/dkrutsko](https://github.com/dkrutsko)