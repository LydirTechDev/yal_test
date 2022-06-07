package com.example.myapplication32.ui.shipmentList

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.myapplication32.models.shipments.ShipmentsToDelevredResponse

class ShipmentListViewModel : ViewModel() {

    private val _text1 = MutableLiveData<String>().apply {
        value = "Vous avez"
    }
    val text1: LiveData<String> = _text1

    private val _shipmentsToDelevry = MutableLiveData<List<ShipmentsToDelevredResponse>>().apply {
        value = emptyList()
    }
    fun setNewListShipment(x : List<ShipmentsToDelevredResponse>) {
        _shipmentsToDelevry.postValue(x)
    }

    val shipmentsToDelevry: LiveData<List<ShipmentsToDelevredResponse>> = _shipmentsToDelevry
}