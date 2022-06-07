package com.example.myapplication32.ui

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.core.view.isVisible
import androidx.fragment.app.activityViewModels
import com.example.myapplication32.R
import com.example.myapplication32.SharedViewModel
import com.example.myapplication32.databinding.FragmentPickupBinding
import com.example.myapplication32.databinding.FragmentReceiveShipmentBinding
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


class ReceiveShipmentFragment : Fragment() {

    private var _binding: FragmentReceiveShipmentBinding? = null
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var sessionManager: SessionManager
    lateinit var apiClient: ApiClient
    // This property is only valid between onCreateView and
    // onDestroyView.ViewModel
    private val binding get() = _binding!!


    @SuppressLint("ResourceType")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding= FragmentReceiveShipmentBinding.inflate(inflater, container, false)

        val root : View = binding.root
        binding.textReceveShipment.text = "Scanner les colis a recevoir"

        val val_scan_package_fab1: Button = binding.button2

        sharedViewModel.val_scan_package_fab1.observe(viewLifecycleOwner){
            val_scan_package_fab1.isVisible = it
        }

        val shipmentChip: ChipGroup = binding.codeList
        sharedViewModel.newShipmentsReceive.observe(viewLifecycleOwner) {
            Log.i("scanne-1", "$it")
            shipmentChip.removeAllViews()
            if (it.size > 0) {
                sharedViewModel.setVisibel()
                binding.button2.text = "Valider ${it.size} colis"
            }else {
                sharedViewModel.setInVisibel()
            }

            for (shipment in it) {
                Log.i("scanne-1", "new shipment in observe: $shipment")
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
                Log.i("scanne-1", "shipmentChip: ${shipmentChip.indexOfChild(newChip)}")
            }
            sessionManager = SessionManager(root.context)
            apiClient = ApiClient()
            Log.i("scanne-1", "seesion: ${sessionManager.fetchUserEmail()}")

            binding.button2.setOnClickListener {
                Log.i(
                    "scanne-1",
                    "send shipment to Api: ${sharedViewModel.newShipmentsReceive.value}"
                )
                Log.i(
                    "scanne-1",
                    "send shipment to Api: ${sharedViewModel.newShipmentsReceive}"
                )
                if (sharedViewModel.newShipmentsReceive.value != null) {
                    apiClient.getApiService(root.context).setShipmentRecue(PickupRequest(sharedViewModel.newShipmentsReceive.value)).enqueue(object :
                        Callback<Boolean> {
                        override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                            Log.i("scanne-1", "onResponse: ${response.body()}")
                            sharedViewModel.clearListReceive()
                        }

                        override fun onFailure(call: Call<Boolean>, t: Throwable) {
                            Log.i("scanne-1", "onFailure: $t")
                        }
                    })
                }
            }
        }
        root.findViewById<FloatingActionButton>(R.id.scan_package_fab_receive)
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
        return root
    }

}