package com.example.myapplication32.ui.shipmentList

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.myapplication32.R
import com.example.myapplication32.SharedViewModel
import com.example.myapplication32.databinding.FragmentShipmentListBinding
import com.example.myapplication32.models.shipments.ShipmentsToDelevredResponse
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.zxing.integration.android.IntentIntegrator
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ShipmentListFragment : Fragment() {

    private var _binding: FragmentShipmentListBinding? = null
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var sessionManager: SessionManager
    private lateinit var apiClient: ApiClient

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val shipmentsListViewModel =
            ViewModelProvider(this)[ShipmentListViewModel::class.java]

        _binding = FragmentShipmentListBinding.inflate(inflater, container, false)
        val root: View = binding.root

        root.findViewById<FloatingActionButton>(R.id.scan_package_fab2).setOnClickListener(View.OnClickListener {
            val intentIntegrator = IntentIntegrator(activity)
            intentIntegrator.setBeepEnabled(true)
            intentIntegrator.setOrientationLocked(false)
            intentIntegrator.setCameraId(0)
            intentIntegrator.setPrompt("SCAN")
            intentIntegrator.setTorchEnabled(true)
            intentIntegrator.setBarcodeImageEnabled(false)
            intentIntegrator.initiateScan()
        })

        apiClient = ApiClient()
        sessionManager = SessionManager(root.context)

        val adapter = ShipmentToDelivryAdapter()
        val recyclerView = binding.recyclerView.findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter

        shipmentsListViewModel.shipmentsToDelevry.observe(viewLifecycleOwner){
            adapter.setData(it)
        }

        apiClient.getApiService(root.context).getShipmentsToBeDelivered().enqueue(object :
            Callback<Array<ShipmentsToDelevredResponse>>{
            override fun onResponse(
                call: Call<Array<ShipmentsToDelevredResponse>>,
                response: Response<Array<ShipmentsToDelevredResponse>>
            ) {
                val shipments = response.body()
                if (shipments != null) {
                    binding.nbShipments.text = shipments.size.toString()
                    shipmentsListViewModel.setNewListShipment(shipments.toList())
                    Log.i("shipmentsTobeDelevred", "response from shipment-of-coursier-a-livrer: ${shipments.size} succscé")
                    Log.i("shipmentsTobeDelevred", "response from shipment-of-coursier-a-livrer: ${shipments.toList()} succscé")
                }
            }

            override fun onFailure(call: Call<Array<ShipmentsToDelevredResponse>>, t: Throwable) {
                Log.i("shipmentsTobeDelevred", "response from shipment-of-coursier-a-livrer: ERROR!!!!!!")
            }
        })
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

}



