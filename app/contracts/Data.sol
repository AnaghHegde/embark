pragma solidity ^0.4.7;
contract Data {
	
	Data[] public data;

	struct Data {
	bytes32 hash;
	bytes32 key;
	}

	function addData(bytes32 key, bytes32 Hash) returns (bool success) {

		Data memory newData;
		newData.key = key;
		newData.hash = Hash;

		// Piece of function changing state. Push it to ethereum
		data.push(newData);

		return true;
	}

	//return the key and hash value pairs
	function getData() constant returns (bytes32[], bytes32[]) {

		uint length = data.length;

		bytes32[] memory key = new bytes32[](length);
		bytes32[] memory hash = new bytes32[](length);

		for(uint i=0; i < data.length; i++ ) {
			Data memory currentData;
			currentData = data[i];

			key[i] = currentData.key;
			hash[i] = currentData.hash;
		}

		return (key,hash);
	}
}
