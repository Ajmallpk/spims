from rest_framework.permissions import BasePermission




"""This file defines custom role-based permission classes.
    It ensures that only authenticated users with specific roles (Citizen, Ward, Panchayath, Block) and ACTIVE status can access certain APIs """

class IsCitizen(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role == "CITIZEN"
    
class IsWard(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "WARD"
    
class IsPanchayath(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role == "PANCHAYATH"
    
class IsBlock(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "BLOCK"
    
class IsActiveUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.status == "ACTIVE"