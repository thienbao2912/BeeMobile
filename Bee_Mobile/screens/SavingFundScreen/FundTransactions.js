import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { fetchTransaction } from '../../services/SavingsFundService';
import tw from "twrnc";
const FundTransactions = ({ fundId }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchTransaction(fundId);
                setTransactions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [fundId]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (loading) {
        return <ActivityIndicator size="large" />;
    }
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    return (
        <View style={tw`mt-4`}>
            <Text style={tw`font-bold mb-2 text-gray-400`}>
                Lịch sử giao dịch
            </Text>
            <View style={tw`bg-white shadow-sm rounded-lg p-4`}>
                {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction, index) => (
                        <View
                            key={index}
                            style={[
                                tw`flex-row items-center py-4`,
                                index < transactions.length - 1 ? tw`border-b border-gray-200` : null,
                            ]}
                        >
                            <Image
                                source={transaction.userId?.avatar ? { uri: transaction.userId.avatar } : require('../../assets/images/animal.png')}
                                style={tw`h-10 w-10 rounded-full`}
                            />
                            <View style={tw`flex-1 ml-4`}>
                                <Text style={tw`text-gray-500 text-lg font-semibold`}>
                                    {transaction.userId?.name || 'Không có'}
                                </Text>
                                <Text style={tw`text-gray-500 text-xs`}>
                                    {transaction.note}
                                </Text>
                            </View>
                            <View style={tw`items-end`}>
                                <Text style={tw`text-gray-500 text-xs`}>
                                    {transaction.date ? formatDate(transaction.date) : 'Không có'}
                                </Text>
                                <Text style={tw`text-green-500 text-lg font-bold`}>
                                    {transaction.amount != null
                                        ? `+ ${new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(transaction.amount)}`
                                        : 'Không có'}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (<Text style={tw`text-gray-500 text-center`}>Không có giao dịch</Text>
                )}
            </View>
        </View>
    );
};
export default FundTransactions;