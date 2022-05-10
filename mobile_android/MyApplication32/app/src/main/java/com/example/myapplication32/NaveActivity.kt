package com.example.myapplication32

import android.content.Intent
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
import com.example.myapplication32.databinding.ActivityNaveBinding
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

    private  val sharedViewModel: SharedViewModel by viewModels()

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sessionManager = SessionManager(this)
        apiClient = ApiClient()

        binding = ActivityNaveBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarNave.toolbar)
        

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_nave)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_dashboard, R.id.nav_pickup, R.id.nav_shipment_list
            ), drawerLayout
        )

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
                sharedViewModel.resetShipments()
                var shipments = response.body()
                if (shipments != null) {
                    for (shipment in shipments){
                        Log.i("shipments", "tracking: $shipment")
                        if (shipment != null) {
                            sharedViewModel.addNewShipments(shipment)
                        }
                    }
                }
            }

            override fun onFailure(call: Call<Array<String?>>, t: Throwable) {
                Log.i("shipments", "body CRASH")
            }
        })
        Log.i("sessionManager", "user: ${sessionManager.fetchUserEmail().toString()}")
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
            if (label == "Pickup"){
                sharedViewModel.setNewCode(scanResult.contents.toString())
                Log.i("himi", "Pickup-------------->: $tt")
            }
            if (label == "colis à livrer"){
                Log.i("himi", "colis à livrer-------------->: $tt")
            }
            Log.i("himi", "scaned-------------->: $tt")
        }
    }
}
