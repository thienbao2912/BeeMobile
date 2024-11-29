import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { fetchMember } from '../../services/SavingsFundService';
import tw from "twrnc";
const FundMembers = ({ fundId }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadMembers = async () => {
            try {
                const data = await fetchMember(fundId);
                setMembers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadMembers();
    }, [fundId]);
    if (loading) {
        return <ActivityIndicator size="large" />;
    }
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    return (
        <View style={tw`mt-4`}>
            <Text style={tw`font-bold mb-2 text-gray-400`}>
                Thành viên: ({members.length})
            </Text>
            {members.length > 0 ? (
                <View style={tw`bg-white shadow-sm rounded-lg p-4`}>
                    {members.map((member, index) => (
                        <View
                            key={member.userId?._id}
                            style={[
                                tw`flex-row items-center py-4`,
                                index < members.length - 1 ? tw`border-b border-gray-200` : null,
                            ]}
                        >
                            <Image
                                source={member.userId?.avatar ? { uri: member.userId.avatar } : require('../../assets/images/animal.png')}
                                style={tw`h-10 w-10 rounded-full`}
                            />
                            <View style={tw`flex-1 ml-4`}>
                                <Text style={tw`text-indigo-500 text-lg font-semibold`}>
                                    {member.userId?.name || 'Không có'}
                                </Text>
                                <Text style={tw`text-gray-500 text-xs`}>
                                    {member.userId?.email || 'Không có'}
                                </Text>
                            </View>
                            <View style={tw`items-end`}>
                                <Text style={tw`text-gray-500 text-xs`}>Đã góp quỹ</Text>
                                <Text style={tw`text-green-500 text-lg font-bold`}>
                                    {member.contribution != null ?
                                        new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(member.contribution) : 'Không có'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={tw`text-gray-500 text-center`}>Không có thành viên</Text>
            )}
        </View>
    );
};
export default FundMembers;