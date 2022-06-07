package com.example.myapplication32

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.Menu
import androidx.activity.viewModels
import com.google.android.material.navigation.NavigationView
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import androidx.drawerlayout.widget.DrawerLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import com.example.myapplication32.databinding.ActivityNaveBinding
import com.example.myapplication32.ui.shipmentList.ShipmentListFragmentDirections
import com.example.myapplication32.ui.shipmentList.ShipmentListViewModel
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import com.google.zxing.integration.android.IntentIntegrator
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class NaveActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityNaveBinding
    lateinit var apiClient: ApiClient
    lateinit var shipmentListViewModel: ShipmentListViewModel

    private  val sharedViewModel: SharedViewModel by viewModels()

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager(this)
        apiClient = ApiClient()

        binding = ActivityNaveBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarNave.toolbar)

        binding.appBarNave.button3.isVisible = false
        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_nave)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_dashboard, R.id.nav_pickup, R.id.shipment_list, R.id.receiveShipmentFragment
            ), drawerLayout
        )

//        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
//        ActivityCompat.requestPermissions(this, arrayOf(android.Manifest.permission.CALL_PHONE) , 1)
//        }

        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.nave, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        /**
         * get list of shipments
         */
        apiClient.getApiService(this).getShipmentsPickupPresExpedition().enqueue(object :Callback<Array<String?>> {
            override fun onResponse(
                call: Call<Array<String?>>,
                response: Response<Array<String?>>
            ) {
                Log.i("shipments", "body ${response.body()}")
                var shipments = response.body()
                if (shipments != null) {
                    for (shipment in shipments){
                        Log.i("shipments", "tracking: $shipment")
                        if (shipment != null) {
                            Log.i("shipments", "shipment :$shipment")
                        }
                    }
                }
            }

            override fun onFailure(call: Call<Array<String?>>, t: Throwable) {
                Log.i("shipments", "body CRASH")
            }

        })

        val navController = findNavController(R.id.nav_host_fragment_content_nave)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        super.onActivityResult(requestCode, resultCode, intent)
        sessionManager = SessionManager(this)
        val scanResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, intent)
        Log.i("himi", "scaned-------------->")
        Log.i("himi", "scanResult->extras: ${scanResult.originalIntent.extras}")

        var label = findNavController(R.id.nav_host_fragment_content_nave).currentDestination?.label.toString()

        if (scanResult != null) {
            val tt = scanResult.contents.toString()
            Log.i("himi", "Pickup-------------->: $label")
            if (label == "Pickup"){
                Log.i("himi", "Pickup-------------->: $tt")
                when(val response = sharedViewModel.setNewShipmentPickup(tt)) {
                    "0"-> Log.i("scaaaaaaaaan", "response from setNewShipmentPickup: $response Ajouter avec succscé")
                    "1"-> Log.i("scaaaaaaaaan", "response from setNewShipmentPickup: $response shipment existe deja")
                }
            }
            if (label == "colis à livrer"){
                Log.i("scaaaaaaaaan", "colis à livrer-------------->: $tt")
                val action = ShipmentListFragmentDirections.actionShipmentListToDetailShipment(tt)
                findNavController(R.id.recyclerView).navigate(action)
                //shipmentListViewModel.findTrackingInList(tt)
            }
            if (label == "fragment_receive_shipment") {
                sharedViewModel.setNewShipmentReceive(tt)
            }
            Log.i("scaaaaaaaaan", "scaned-------------->: $tt")
        } else {
            super.onActivityResult(requestCode, resultCode, intent)
            val intent = Intent(this, NaveActivity::class.java)
            startActivity(intent)
        }
    }
}
