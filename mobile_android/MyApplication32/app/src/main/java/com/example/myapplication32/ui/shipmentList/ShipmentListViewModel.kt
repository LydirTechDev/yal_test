package com.example.myapplication32.ui.shipmentList

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ShipmentListViewModel : ViewModel() {

    private val _text1 = MutableLiveData<String>().apply {
        value = "Vous avez"
    }
    val text1: LiveData<String> = _text1
}