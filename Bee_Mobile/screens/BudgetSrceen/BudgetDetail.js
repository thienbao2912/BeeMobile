import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BudgetDetail = ({ route, navigation }) => {
    const { budget } = route.params;

    const totalExpenses = budget.expenses.reduce((acc, expense) => acc + expense, 0);
    const remainingAmount = budget.totalAmount - totalExpenses;

    const calculateProgress = (remainingAmount, totalAmount) => {
        if (totalAmount <= 0) return 0;
        return (remainingAmount / totalAmount) * 100;
    };

    const getProgressBarColor = (remainingAmount, totalAmount) => {
        const progress = calculateProgress(remainingAmount, totalAmount);
        if (progress >= 50) return 'green';
        if (progress >= 25) return 'blue';
        if (progress > 0) return 'orange';
        return 'red';
    };

    const progressPercentage = calculateProgress(remainingAmount, budget.totalAmount);
    const progressColor = getProgressBarColor(remainingAmount, budget.totalAmount);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('BudgetEdit', { budget })}
                >
                    <Icon name="edit" size={24} color="#6B46C1" />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Image source={budget.icon} style={styles.budgetIcon} />
                    <View style={styles.budgetInfo}>
                        <Text style={styles.budgetName}>{budget.name}</Text>
                        <Text style={styles.budgetDate}>{budget.startDate} - {budget.endDate}</Text>
                        <Text style={styles.budgetAmount}>Ngân sách: {budget.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                        <Text style={styles.remainingAmount}>Số tiền còn lại: {remainingAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </View>
                </View>
                <ProgressBar 
                    progress={remainingAmount >= 0 ? progressPercentage / 100 : 1} 
                    color={progressColor} 
                    style={styles.progressBar} 
                />
                <Text style={[styles.budgetStatus, { color: remainingAmount <= 0 ? 'red' : progressColor }]}>
                    {remainingAmount < 0 
                        ? 'Chi tiêu vượt ngân sách' 
                        : `Ngân sách còn ${Math.round(progressPercentage)}%`
                    }
                </Text>
            </View>

            <View style={styles.transactionHistory}>
                <Text style={styles.historyTitle}>Lịch sử giao dịch</Text>
                {/* Giả lập các giao dịch, bạn có thể lấy dữ liệu từ API hoặc nguồn dữ liệu khác */}
                {budget.expenses.map((expense, index) => (
                    <View key={index} style={styles.transactionItem}>
                        <Image source={require("../../assets/images/favicon.png")} style={styles.transactionIcon} />
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionTitle}>Chi tiêu {index + 1}</Text>
                            <Text style={styles.transactionNote}>Ghi chú: Chi tiêu cho {expense.description}</Text>
                        </View>
                        <Text style={styles.transactionAmount}>-{expense.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    cardContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    budgetIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 20,
    },
    budgetInfo: {
        flex: 1,
    },
    budgetName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    budgetDate: {
        color: '#757575',
    },
    budgetAmount: {
        color: '#757575',
    },
    remainingAmount: {
        color: '#757575',
    },
    progressBar: {
        height: 8,
        borderRadius: 5,
        marginTop: 10,
    },
    budgetStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    transactionHistory: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontWeight: 'bold',
    },
    transactionNote: {
        color: '#757575',
    },
    transactionAmount: {
        fontWeight: 'bold',
        color: 'red', // Màu đỏ cho số tiền chi tiêu
    },
});

export default BudgetDetail;
