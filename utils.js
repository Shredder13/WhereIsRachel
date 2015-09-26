/* UTILS - Add helper functions */

// Search for id
function SearchIdInArray(id, arr){
	for (var key in arr){
		if (arr[key].billID === id){
			return key;
		}
	}
	return -1;
}

  // // Search for a bill by id
  // function searchById (id, arr){
  //   // alert(id);
  //  var found = $filter('filter')(arr, {billID: id}, true);
  //  if (found.length) {
  //      $scope.selected = JSON.stringify(found[0]);
  //  } else {
  //      $scope.selected = 'Not found';
  //  }
  // };


function findById(arr, key, valueToSearch) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][key] == valueToSearch) {
			return i;
		}
	}
return null;
}




module.exports.SearchIdInArray = SearchIdInArray;
module.exports.findById = findById;


