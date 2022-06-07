package com.example.myapplication32.ui.dashboard

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.myapplication32.databinding.FragmentDashboardBinding
import com.example.myapplication32.models.shipments.StatistiqueResponse
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
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
        val homeViewModel =
            ViewModelProvider(this)[DashboardViewModel::class.java]

        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        val root: View = binding.root

        apiClient = ApiClient()
        sessionManager = SessionManager(root.context)

        apiClient.getApiService(root.context).getStat().enqueue(object : Callback<StatistiqueResponse> {
            override fun onResponse(
                call: Call<StatistiqueResponse>,
                response: Response<StatistiqueResponse>
            ) {
                Log.i("stat", "${response.body()}")
                binding.idCard1Val.text = response.body()?.enAttente.toString()
                binding.idCard2Val.text = response.body()?.total.toString()
            }

            override fun onFailure(call: Call<StatistiqueResponse>, t: Throwable) {
                TODO("Not yet implemented")
            }

        })
        /** val textView: TextView = binding.textHome

        homeViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        } **/
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}