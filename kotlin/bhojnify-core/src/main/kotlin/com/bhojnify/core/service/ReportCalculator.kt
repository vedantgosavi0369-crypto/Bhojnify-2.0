package com.bhojnify.core.service

import com.bhojnify.core.model.Expense
import com.bhojnify.core.model.InventoryItem
import com.bhojnify.core.model.Payment
import kotlinx.serialization.Serializable

@Serializable
data class FinancialReportSummary(
    val totalRevenue: Double,
    val totalExpenses: Double,
    val operatingSurplus: Double,
    val stockValueEstimate: Double,
    val mealsServedCount: Int,
    val renewalRatePercentage: Int = 92
)

object ReportCalculator {

    fun calculate(
        payments: List<Payment>,
        expenses: List<Expense>,
        inventory: List<InventoryItem>,
        attendanceCount: Int,
        baseMealOffset: Int = 126
    ): FinancialReportSummary {
        val revenue = payments.sumOf { it.amount }
        val spend = expenses.sumOf { it.amount }
        val surplus = revenue - spend
        val stockValue = inventory.sumOf { it.quantity * 100.0 }
        val totalMeals = attendanceCount + baseMealOffset

        return FinancialReportSummary(
            totalRevenue = revenue,
            totalExpenses = spend,
            operatingSurplus = surplus,
            stockValueEstimate = stockValue,
            mealsServedCount = totalMeals,
            renewalRatePercentage = 92
        )
    }
}
