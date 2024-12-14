import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import changePassword from "../screens/ProfileScreen/changePasswordScreen";
const ProfileStack = createStackNavigator();
function ProfileStackScreen () {
    return(
        <ProfileStack.Navigator>
            <ProfileStack.Screen 
            name = "ProfileScreen"
            component={ProfileScreen}
            options={{title:"Hồ sơ"}}
            />
            <ProfileStack.Screen 
            name="ChangePassword"
            component={changePassword}
            options={{title:"Thay đổi mật khẩu"}}
            />

            
        </ProfileStack.Navigator>
    )
}
export default ProfileStackScreen;