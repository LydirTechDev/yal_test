package com.example.myapplication32.ui.pickup

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class PickupViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "Scanner les colis à ramasser"
    }
    val text: LiveData<String> = _text

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