from rest_framework import serializers
from django.contrib.auth import get_user_model


"""Handles user registration, validates password confirmation, 
    assigns role, and creates a new user with PENDING status"""

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["username","email","password","confirm_password","role"]
        
    def validate(self,data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Password do not match")
        return data
    
    def create(self,validated_data):
        
        validated_data.pop("confirm_password")
        role = validated_data.pop("role")
        
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password= validated_data["password"],
        )
        
        user.role = role 
        user.status = "PENDING"
        user.save()
        
        return user