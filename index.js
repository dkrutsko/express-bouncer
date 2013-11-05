////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                        (C) 2012-2013  David Krutsko                        //
//                        See LICENSE.md for copyright                        //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Represents the main bouncer application exposed through the exports module.

function bouncer()
{
	//----------------------------------------------------------------------------//
	// Properties                                                                 //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// A list of current failed attempts. Clear by overriding with new object.

	this.failures = { };

	////////////////////////////////////////////////////////////////////////////////
	/// A list of white-listed ip addresses. These addresses will not be blocked.

	this.whitelist = [ ];

	////////////////////////////////////////////////////////////////////////////////
	/// The number of attempts the user can make before being forced to wait.

	this.freeAttempts = 2;

	////////////////////////////////////////////////////////////////////////////////
	/// The minimum and maximum milliseconds the user will be forced to wait.

	this.minWait = 500;
	this.maxWait = 600000;

	////////////////////////////////////////////////////////////////////////////////
	/// Called when a request has been blocked. Override for custom functionality.
	/// remaining: milliseconds remaining before a new attempt can be made.

	this.failure = function (req, res, next, remaining)
	{
	}



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// Resets the wait time between attempts for the specified request.

	this.reset = function (req)
	{
	}

	////////////////////////////////////////////////////////////////////////////////
	/// Middleware which will block requests that are happening too often.

	this.block = function (req, res, next)
	{
	}
}



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

exports = module.exports = function() { return new bouncer() };
