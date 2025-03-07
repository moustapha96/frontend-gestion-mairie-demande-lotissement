'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Save, Building, MapPin, Phone, Globe, Mail, Link2, Loader } from 'lucide-react'
import { AdminBreadcrumb } from "@/components";
import { toast } from 'sonner'

import { useAuthContext } from '../../../context/useAuthContext';
import { getDetailsEntreprise, updateCompanyInfo } from '../../../services/entrepriseFunctionService';
import { AppContext } from '../../../AppContext';
import axios from 'axios';


const AdminCompte = () => {



}

export default AdminCompte;