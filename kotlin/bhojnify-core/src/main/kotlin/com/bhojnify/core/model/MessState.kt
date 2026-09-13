package com.bhojnify.core.model

import com.bhojnify.core.i18n.Language
import kotlinx.serialization.Serializable

@Serializable
data class MessState(
    val role: Role = Role.OWNER,
    val language: Language = Language.EN,
    val onboardingComplete: Boolean = false,
    val credits: Int = 18,
    val expiresOn: String = "2026-09-18",
    val profile: OwnerProfile = OwnerProfile(),
    val policies: OwnerPolicies = OwnerPolicies(),
    val attendance: List<AttendanceRecord> = emptyList(),
    val customers: List<Customer> = emptyList(),
    val leaves: List<LeaveRequest> = emptyList(),
    val payments: List<Payment> = emptyList(),
    val inventory: List<InventoryItem> = emptyList(),
    val menus: List<MenuItem> = emptyList(),
    val staff: List<StaffMember> = emptyList(),
    val expenses: List<Expense> = emptyList(),
    val feedback: List<Feedback> = emptyList(),
    val reminders: List<Reminder> = emptyList()
) {
    companion object {
        fun defaultInitialState(today: String = "2026-09-11"): MessState {
            return MessState(
                role = Role.OWNER,
                language = Language.EN,
                onboardingComplete = false,
                credits = 18,
                expiresOn = "2026-09-18",
                profile = OwnerProfile(
                    name = "",
                    messName = "",
                    phone = "",
                    location = "",
                    email = ""
                ),
                policies = OwnerPolicies(rules = "", privacy = ""),
                attendance = listOf(
                    AttendanceRecord("a1", today, Meal.BREAKFAST, "08:04 AM", true, "Biometric + GPS"),
                    AttendanceRecord("a2", today, Meal.LUNCH, "01:12 PM", true, "Biometric + GPS"),
                    AttendanceRecord("a3", "2026-09-01", Meal.DINNER, "08:06 PM", true, "Biometric + GPS")
                ),
                customers = listOf(
                    Customer(
                        id = "c1",
                        name = "Rohan Patil",
                        plan = MessPlans.MONTHLY_UNLIMITED,
                        joiningDate = "2026-09-01",
                        expiryDate = "2026-10-01",
                        paymentStatus = CustomerPaymentStatus.PAID,
                        phone = "+91 98221 44550"
                    ),
                    Customer(
                        id = "c2",
                        name = "Priya Sharma",
                        plan = MessPlans.MONTHLY_LUNCH_ONLY,
                        joiningDate = "2026-08-13",
                        expiryDate = "2026-09-12",
                        paymentStatus = CustomerPaymentStatus.PAID,
                        phone = "+91 97654 32100"
                    ),
                    Customer(
                        id = "c3",
                        name = "Amit Deshmukh",
                        plan = MessPlans.MONTHLY_DINNER_ONLY,
                        joiningDate = "2026-08-11",
                        expiryDate = today,
                        paymentStatus = CustomerPaymentStatus.PAID,
                        phone = "+91 98900 11223"
                    ),
                    Customer(
                        id = "c4",
                        name = "Sneha Kulkarni",
                        plan = MessPlans.FIFTEEN_DAY_FLEXI,
                        joiningDate = "2026-08-20",
                        expiryDate = "2026-09-05",
                        paymentStatus = CustomerPaymentStatus.UNPAID,
                        phone = "+91 94230 99887"
                    )
                ),
                leaves = listOf(
                    LeaveRequest("l1", "c1", "2026-09-08", "2026-09-10", "Family function", LeaveStatus.PENDING),
                    LeaveRequest("l2", "c2", "2026-09-09", null, "Going home for festival", LeaveStatus.PENDING)
                ),
                payments = listOf(
                    Payment("p1", "2026-08-18", 4200.0, "UPI", "September meal plan"),
                    Payment("p2", "2026-07-18", 4200.0, "UPI", "August meal plan")
                ),
                inventory = listOf(
                    InventoryItem("i1", "Basmati rice", 32.0, "kg", 24.0, "Grains"),
                    InventoryItem("i2", "Toor dal", 18.0, "kg", 20.0, "Pulses"),
                    InventoryItem("i3", "Cooking oil", 12.0, "L", 10.0, "Essentials"),
                    InventoryItem("i4", "Onions", 24.0, "kg", 18.0, "Produce")
                ),
                menus = listOf(
                    MenuItem("m1", today, Meal.BREAKFAST, "Masala dosa", "Coconut chutney · Sambar"),
                    MenuItem("m2", today, Meal.LUNCH, "Rajma rice", "Cucumber salad · Buttermilk"),
                    MenuItem("m3", today, Meal.DINNER, "Paneer bhurji", "Phulka · Seasonal vegetables"),
                    MenuItem("m4", "2026-09-12", Meal.BREAKFAST, "Poha & chai", "Peanuts · Fresh fruit")
                ),
                staff = listOf(
                    StaffMember("s1", "Meena Joshi", "Head Cook", "+91 98204 16320", 28000.0),
                    StaffMember("s2", "Rakesh Kumar", "Server", "+91 99102 76211", 19000.0)
                ),
                expenses = listOf(
                    Expense("e1", "2026-09-01", "Inventory", 12400.0, "Weekly produce purchase"),
                    Expense("e2", "2026-09-01", "Gas", 1800.0, "Cylinder refill"),
                    Expense("e3", "2026-08-30", "Maintenance", 950.0, "Exhaust fan service")
                ),
                feedback = listOf(
                    Feedback("f1", "Rajma rice", 4, "Comforting and nicely spiced.", "2026-09-01")
                ),
                reminders = listOf(
                    Reminder("r1", "Check cooking oil supply", "Review reorder quantity before the next delivery.", today, today)
                )
            )
        }
    }
}
