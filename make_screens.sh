#!/bin/bash
SCREENS=("CustomersScreen" "InventoryScreen" "LeaveScreen" "MenuScreen" "ExpensesScreen" "PaymentsScreen" "ReportScreen" "StaffScreen" "FeedbackScreen")
DIR="./WigglyMustyGnuassembler (1)/kotlin/bhojnify-android/src/main/kotlin/com/bhojnify/android/screens"

for SCREEN in "${SCREENS[@]}"; do
    cat << KOTLIN > "$DIR/$SCREEN.kt"
package com.bhojnify.android.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.bhojnify.android.viewmodel.MessViewModel

@Composable
fun $SCREEN(navController: NavController, viewModel: MessViewModel) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("$SCREEN")
    }
}
KOTLIN
done
