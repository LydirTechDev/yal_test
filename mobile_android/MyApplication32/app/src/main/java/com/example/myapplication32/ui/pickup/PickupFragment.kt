package com.example.myapplication32.ui.pickup

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.myapplication32.R
import com.example.myapplication32.SharedViewModel
import com.example.myapplication32.databinding.FragmentPickupBinding
import com.example.myapplication32.models.pickup.PickupRequest
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.zxing.integration.android.IntentIntegrator
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class PickupFragment : Fragment() {

    private var _binding: FragmentPickupBinding? = null
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var sessionManager: SessionManager
    lateinit var apiClient: ApiClient
    // This property is only valid between onCreateView and
    // onDestroyView.ViewModel
    private val binding get() = _binding!!


    @SuppressLint("ResourceType")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val pickupViewModel =
            ViewModelProvider(this).get(PickupViewModel::class.java)

        _binding = FragmentPickupBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textGallery

        pickupViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        val val_scan_package_fab1: Button = binding.button2

        pickupViewModel.val_scan_package_fab1.observe(viewLifecycleOwner) {
            val_scan_package_fab1.isVisible = it
        }

        val shipmentChip: ChipGroup = binding.codeList
        sharedViewModel.newShipmentsPickup.observe(viewLifecycleOwner) {
            Log.i("scaaaaaaaaan", "observe --> :$it")
            shipmentChip.removeAllViews()
            if (it.size > 0) {
                pickupViewModel.setVisibel()
                binding.button2.text = "Valider ${it.size} colis"
            }else {
                pickupViewModel.setInVisibel()
            }
            var index = 0
            for (shipment in it) {
                Log.i("scaaaaaaaaan", "new shipment in observe: $shipment")
                val newChip = Chip(this.context)
                newChip.text = shipment
                newChip.isCheckable = true
                newChip.isChecked = true
                newChip.isCheckedIconVisible = true
                newChip.isCloseIconVisible = true
                newChip.setOnCloseIconClickListener {
                    sharedViewModel.removeOnShipment(shipment)
                }
                shipmentChip.addView(newChip)
                Log.i("scaaaaaaaaan", "shipmentChip: ${shipmentChip.indexOfChild(newChip)}")
            }

        }
        sessionManager = SessionManager(root.context)
        apiClient = ApiClient()
        Log.i("scaaaaaaaaan", "seesion: ${sessionManager.fetchUserEmail()}")
        binding.button2.setOnClickListener {
            Log.i(
                "scaaaaaaaaan",
                "send shipment to Api: ${sharedViewModel.newShipmentsPickup.value}"
            )
            Log.i(
                "scaaaaaaaaan",
                "send shipment to Api: ${sharedViewModel.newShipmentsPickup}"
            )
            if (sharedViewModel.newShipmentsPickup.value != null){
                apiClient.getApiService(root.context).setShipmentRamasser(PickupRequest(
                    sharedViewModel.newShipmentsPickup.value
                )).enqueue(object :Callback<Boolean> {
                    override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                        Log.i("scaaaaaaaaan", "onResponse: ${response.body()}")
                        sharedViewModel.clearList()
                    }

                    override fun onFailure(call: Call<Boolean>, t: Throwable) {
                        Log.i("scaaaaaaaaan", "onFailure: $t")
                    }
                })
            }

        }
        /**
         * .enqueue(object :Callback<Boolean> {
        override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
        Log.i("scaaaaaaaaan", "onResponse: ${response.body()}")
        }

        override fun onFailure(call: Call<Boolean>, t: Throwable) {
        Log.i("scaaaaaaaaan", "onFailure: $t")
        }
        })
         */
//        Log.i("scannnnnn", "list:$it")
//        if (it.size > 0 ){
//            for (shipment in it) {
//                Log.i("scannnnnn", "new scan: $shipment")
//                val newChip = chip
//                newChip.text = shipment.toString()
//                newChip.isCloseIconVisible = true
//                newChip.isCheckable = true
//                newChip.isCheckedIconVisible = true
//                newChip.setOnCloseIconClickListener {
//                    binding.codeList.removeView(newChip)
//                    sharedViewModel.codelive.value = ""
//                }
//                binding.codeList.addView(newChip)
//            }
//        }
        /**
         * scan new shipments for pickup
         */
        root.findViewById<FloatingActionButton>(R.id.scan_package_fab1)
            .setOnClickListener(View.OnClickListener {
                val intentIntegrator = IntentIntegrator(activity)
                intentIntegrator.setBeepEnabled(true)
                intentIntegrator.setOrientationLocked(false)
                intentIntegrator.setCameraId(0)
                intentIntegrator.setPrompt("SCAN")
                intentIntegrator.setTorchEnabled(true)
                intentIntegrator.setBarcodeImageEnabled(false)
                intentIntegrator.initiateScan()
            })
        /**
         *
         */
        return root
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}


