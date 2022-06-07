package com.example.myapplication32

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModel: ViewModel() {

    /**
     * faux verifier les colis pre à expidier
     */
    private val _newShipmentsPickup = MutableLiveData<ArrayList<String>>().apply {
        value = ArrayList()
    }

    fun setNewShipmentPickup(x: String): String {
        val shipmentList = _newShipmentsPickup.value
        Log.i("scaaaaaaaaan", "setNewShipmentPickup -> shipmentList: $shipmentList")
        return if (shipmentList != null && x.length == 8 && !shipmentList.contains(x)) {
            var tt = shipmentList.add(x)
            Log.i("scaaaaaaaaan", " setNewShipmentPickup -> newShipment:$tt")
            Log.i("scaaaaaaaaan", " setNewShipmentPickup -> newShipmentList:$shipmentList")
            _newShipmentsPickup.postValue(shipmentList)
            "0"
        } else {
            "1"
        }
    }

    fun removeOnShipment(x: String): String {
        val shipmentList = _newShipmentsPickup.value
        shipmentList?.remove(x)
        _newShipmentsPickup.postValue(shipmentList)
        return "0"
    }

    fun clearList() {
        var shipmentList = _newShipmentsPickup.value
        shipmentList?.clear()
        _newShipmentsPickup.postValue(shipmentList)
    }

    val newShipmentsPickup: LiveData<ArrayList<String>> = _newShipmentsPickup

    /**
     * faux verifier les colis pre à expidier
     */
    private val _newShipmentsReceive = MutableLiveData<ArrayList<String>>().apply {
        value = ArrayList()
    }

    fun setNewShipmentReceive(x: String): String {
        val shipmentList = _newShipmentsReceive.value
        Log.i("scaaaaaaaaan", "setNewShipmentPickup -> shipmentList: $shipmentList")
        return if (shipmentList != null && x.length == 8 && !shipmentList.contains(x)) {
            var tt = shipmentList.add(x)
            Log.i("scaaaaaaaaan", " setNewShipmentPickup -> newShipment:$tt")
            Log.i("scaaaaaaaaan", " setNewShipmentPickup -> newShipmentList:$shipmentList")
            _newShipmentsReceive.postValue(shipmentList)
            "0"
        } else {
            "1"
        }
    }

    fun removeOnShipmentReceive(x: String): String {
        val shipmentList = _newShipmentsReceive.value
        shipmentList?.remove(x)
        _newShipmentsReceive.postValue(shipmentList)
        return "0"
    }

    fun clearListReceive() {
        var shipmentList = _newShipmentsReceive.value
        shipmentList?.clear()
        _newShipmentsReceive.postValue(shipmentList)
    }

    val newShipmentsReceive: LiveData<ArrayList<String>> = _newShipmentsReceive


    private val _val_scan_package_fab1 = MutableLiveData<Boolean>().apply {
        value = false
    }
    fun setVisibel(){
        _val_scan_package_fab1.postValue(true)
    }
    fun setInVisibel(){
        _val_scan_package_fab1.postValue(false)
    }
    val val_scan_package_fab1: LiveData<Boolean> = _val_scan_package_fab1

}