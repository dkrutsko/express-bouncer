////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                        (C) 2013-2016  David Krutsko                        //
//                        See LICENSE.md for copyright                        //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Application                                                                //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Represents the main bouncer application exposed through the exports module.

function bouncer (min, max, free)
{
	//----------------------------------------------------------------------------//
	// Constructor                                                                //
	//----------------------------------------------------------------------------//

	// Bind this instance
	var instance = this;

	// Setup any required default arguments
	if (typeof min  !== "number") min  = 500;
	if (typeof max  !== "number") max  = 600000;
	if (typeof free !== "number") free = 2;

	// Validate the arguments
	if (min  <   1) min  = 1;
	if (max  < min) max  = min;
	if (free <   0) free = 0;

	// Store precomputed delays
	var delays = [ ];

	// Include any free attempts
	while (free--) delays.push (0);

	delays.push (min);
	delays.push (min);
	while (true)
	{
		// Compute delays using Fibonacci formula
		var value = delays[delays.length - 1] +
					delays[delays.length - 2];

		if (value > max) {
			delays.push (max);
			break;
		}

		delays.push (value);
	}

	setInterval (function() {
		var now = Date.now();
		// Remove any possible dormant addresses
		for (var address in instance.addresses) {
			if (now - instance.
				addresses[address].lastAttempt > max)
				delete instance.addresses[address];
		}
	}, 1800000);



	//----------------------------------------------------------------------------//
	// Properties                                                                 //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// A list of logged IP addresses. Cleared by overriding with new object.

	this.addresses = { };

	////////////////////////////////////////////////////////////////////////////////
	/// A list of white-listed IP addresses. These addresses will never be blocked.

	this.whitelist = [ ];

	////////////////////////////////////////////////////////////////////////////////
	/// Called when a request has been blocked. Override for custom functionality.

	this.blocked = function (req, res, next, remaining)
	{
		res.send (429, "Too many requests have been made, " +
			"please wait " + remaining / 1000 + " seconds");
	};



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// Resets the wait time between attempts for the specified request.

	this.reset = function (req)
	{
		var address; try { address =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress ||
			req.socket.remoteAddress || req.connection.socket.remoteAddress;
		} catch (error) { }

		// Remove the current address from block list
		address && delete instance.addresses[address];
	};

	////////////////////////////////////////////////////////////////////////////////
	/// Middleware that will block requests which are occurring too often.

	this.block = function (req, res, next)
	{
		var address; try { address =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress ||
			req.socket.remoteAddress || req.connection.socket.remoteAddress;
		} catch (error) { }

		// Allow any invalid or white-listed IP addresses
		if (!address || instance.whitelist.indexOf (address) > -1)
			{ typeof next === "function" && next(); return; }

		// Retrieve or create logged address
		var fail = instance.addresses[address] ||
					{ count: 0, lastAttempt: 0 };

		// Compute the wait time remaining
		var remaining = fail.lastAttempt +
			delays[fail.count] - Date.now();

		if (remaining > 0)
			// Stop current request from going through
			instance.blocked (req, res, next, remaining);

		else
		{
			// Increment the request counter
			fail.lastAttempt = Date.now();
			if (fail.count < delays.length - 1)
				fail.count++;

			// Save the address back to the list
			instance.addresses[address] = fail;

			// Allow the request to go through
			typeof next === "function" && next();
		}
	};
}



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

exports = module.exports =
	function (min, max, free) { return new bouncer (min, max, free); };
