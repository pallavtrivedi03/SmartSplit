var _ = require('lodash');

var array1 = [ { _id: 59df13144007ec14c86a9b72,
       friendNumber: '8433719458',
       friendName: 'pallav.trivedi' },
     { _id: 59df13144007ec14c86a9b71,
       friendNumber: '888888888',
       friendName: 'kishan' },
     { _id: 59df1326d42e1b14e9a181e7,
       friendNumber: '99999999',
       friendName: 'pranav' } ] ;
array1.forEach(function(member)
	{
		member._id.toString;
	});
array1.forEach(function(v){ delete v._id });
console.log(array1);
var array2 = [ { friendName: 'pallav.trivedi',
    friendNumber: '8433719458' },
  { friendName: 'tania',
    friendNumber: '8888888' } ];

//console.log(_.differenceWith(array1,array2,_.isEqual));

