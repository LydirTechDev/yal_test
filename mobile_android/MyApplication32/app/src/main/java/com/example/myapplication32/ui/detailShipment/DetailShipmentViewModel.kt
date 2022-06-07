package com.example.myapplication32.ui.detailShipment

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.myapplication32.models.shipments.InfoShipmentToDelevredResponse
import com.example.myapplication32.models.shipments.ShipmentsToDelevredResponse

class DetailShipmentViewModel: ViewModel() {

    private val _shipment = MutableLiveData<InfoShipmentToDelevredResponse>().apply {
        value = null
    }

    fun setNewShipment(x: InfoShipmentToDelevredResponse){
        Log.i("info", "setNewShipment  --> :$x")
        _shipment.postValue(x)
    }

    fun resetShipment() {
        _shipment.postValue(null)
    }
    val shipment: LiveData<InfoShipmentToDelevredResponse> = _shipment
}