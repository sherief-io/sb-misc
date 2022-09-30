pattern {
	metadata {
		id = "42187b89dba92200868a7c841f96191f"
		name = "Network Switch"
		description = ""
		citype = "cmdb_ci_ip_switch"
	}
	identification {
		name = "discovery"
		entry_point {type = "*"}
		find_process_strategy {strategy = NONE}
		step {
			name = "SNMP Classify Initialization"
			ref {refid = "7c5b071ddba52200868a7c841f96194e"}
		}
		step {
			name = "Set name to cmdb_ci_ip_switch"
			set_attr {
				"cmdb_ci_ip_switch[*].name"
				get_attr {"formattedSysName"}
			}
		}
		step {
			name = "Insert model to cmdb_ci_ip_switch"
			set_attr {
				"cmdb_ci_ip_switch[*].model_id"
				get_attr {"entPhysicalTable[1].entPhysicalModelName"}
			}
		}
		step {
			name = "Insert manufacturer to cmdb_ci_ip_switch"
			set_attr {
				"cmdb_ci_ip_switch[*].manufacturer"
				get_attr {"entPhysicalTable[1].entPhysicalMfgName"}
			}
		}
		step {
			name = "SNMP Identify"
			ref {refid = "c54f14e1db692200868a7c841f961941"}
		}
		step {
			name = "Validate Serial number or Name is not empty"
			match {
				any {
					is_not_empty {get_attr {"cmdb_serial_number[1].serial_number"}}
					is_not_empty {get_attr {"cmdb_ci_ip_switch[1].name"}}
				}
				terminate_op = terminate
				terminate_msg = ""
			}
		}
		step {
			name = "Insert serial number to cmdb_ci_ip_switch"
			set_attr {
				"cmdb_ci_ip_switch[*].serial_number"
				get_attr {"cmdb_serial_number[1].serial_number"}
			}
		}
		step {
			name = "Reference between cmdb_serial_number to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_serial_number"
				table2_name = "cmdb_ci_ip_switch"
				result_table_name = "serial_number_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				ref_direction = parentToChild
				ref_field_name = "configuration_item"
			}
		}
		step {
			name = "Reference and relation between cmdb_ci_network_adapter to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_ci_ip_switch"
				table2_name = "cmdb_ci_network_adapter"
				result_table_name = "network_adapter_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				relation_type = "Owns::Owned by"
				ref_direction = childToParent
				ref_field_name = "cmdb_ci"
			}
		}
		step {
			name = "Relation between cmdb_ci_ip_address to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_ci_ip_switch"
				table2_name = "cmdb_ci_ip_address"
				result_table_name = "ip_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				relation_type = "Owns::Owned by"
				ref_direction = parentToChild
				ref_field_name = ""
			}
		}
		step {
			name = "SNMP - ARP Table"
			ref {refid = "c129995037c3a60006b216a543990efa"}
		}
		step {
			name = "Reference between discovery_net_arp_table to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "discovery_net_arp_table"
				table2_name = "cmdb_ci_ip_switch"
				result_table_name = "arp_ip_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				ref_direction = parentToChild
				ref_field_name = "cmdb_ci"
			}
		}
		step {
			name = "DNS"
			ref {refid = "ede27fe5db652200868a7c841f961984"}
		}
		step {
			name = "Get Switch name from DNS data if isSnmpTrusted is false"
			if {
				condition = all {
					is_not_empty {get_attr {"DnsTable"}}
					eq {
						get_attr {"isSnmpTrusted"}
						"false"
					}
				}
				on_true = parse_var_to_var {
					from_var_name = "DnsTable[1].fqdn"
					to_var_names = "switch_name"
					parsing_strategy = delimited_parsing {
						delimiters = "."
						selected_positions = 1
					}
					if_not_found_do = nop {}
				}
				on_false = nop {}
			}
		}
		step {
			name = "Set Switch Name from DNS data"
			if {
				condition = is_not_empty {get_attr {"switch_name"}}
				on_true = transform {
					src_table_name = "cmdb_ci_ip_switch"
					target_table_name = "cmdb_ci_ip_switch"
					operation {set_field {
							field_name = "name"
							value = get_attr {"switch_name"}
						}}
				}
				on_false = nop {}
			}
		}
		step {
			name = "IP Device Handler"
			ref {refid = "36580a7ddba92200868a7c841f961985"}
		}
		step {
			name = "Insert ip address of cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunBaseSNMPHandlers"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].ip_address"
					get_attr {"computer_system.managementIP"}
				}
				on_false = nop {}
			}
		}
		step {
			name = "Insert description of cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunBaseSNMPHandlers"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].short_description"
					get_attr {"detailedDescription"}
				}
				on_false = nop {}
			}
		}
		step {
			name = "SNMP - Routing"
			ref {refid = "f3046bcadba52200868a7c841f9619d4"}
		}
		step {
			name = "Reference and relation between dscy_router_interface to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_ci_ip_switch"
				table2_name = "dscy_router_interface"
				result_table_name = "router_interface_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				relation_type = "Uses::Used by"
				ref_direction = childToParent
				ref_field_name = "cmdb_ci"
			}
		}
		step {
			name = "Reference and relation between dscy_route_interface to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_ci_ip_switch"
				table2_name = "dscy_route_interface"
				result_table_name = "route_interface_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				relation_type = "Uses::Used by"
				ref_direction = childToParent
				ref_field_name = "cmdb_ci"
			}
		}
		step {
			name = "Reference and relation between dscy_route_next_hop to cmdb_ci_ip_switch"
			relation_reference {
				table1_name = "cmdb_ci_ip_switch"
				table2_name = "dscy_route_next_hop"
				result_table_name = "next_hop_switch"
				unmatched_lines = remove
				condition = eq {
					"1"
					"1"
				}
				relation_type = "Uses::Used by"
				ref_direction = childToParent
				ref_field_name = "cmdb_ci"
			}
		}
		step {
			name = "Insert router indicator of cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunRouterLogic"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].can_route"
					"true"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Insert physical_interface_count to cmdb_ci_ip_switch"
			if {
				condition = all {
					eq {
						get_attr {"shouldRunRouterLogic"}
						"true"
					}
					is_not_empty {get_attr {"routerExitInterfacesTable"}}
					is_not_empty {get_attr {"physicalInterfaceTypes"}}
				}
				on_true = transform {
					src_table_name = "cmdb_ci_ip_switch"
					target_table_name = "cmdb_ci_ip_switch"
					operation {set_field {
							field_name = "physical_interface_count"
							value = eval {"javascript: var rtrn = '';
var routerExitInterfacesTable = ${routerExitInterfacesTable};
var routeMask;
var interfaceType;
var physicalInterfaceTypesArray = ${physicalInterfaceTypes}.split(\",\");
var numOfPhysicalInterfaces = 0;

try{
   for(var i = 0; i < routerExitInterfacesTable.size(); i++)
   {
      routeMask = routerExitInterfacesTable.get(i).get(\"ipRouteMask\");
      interfaceType = routerExitInterfacesTable.get(i).get(\"ifType\");
      if(routeMask != \"255.255.255.255\" && physicalInterfaceTypesArray.indexOf(interfaceType + '') > -1){
         numOfPhysicalInterfaces++;
      }
   }
   rtrn = numOfPhysicalInterfaces.toFixed(0);
}catch (e){
   ms.log(\"Make sure routerExitInterfacesTable or physicalInterfaceTypes are not empty\" + e);
}
"}
						}}
				}
				on_false = nop {}
			}
		}
		step {
			name = "SNMP - Switching"
			ref {refid = "8a93d76fdba52200868a7c841f9619be"}
		}
		step {
			name = "Insert number of ports in cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].ports"
					get_attr {"dot1dBaseNumPorts"}
				}
				on_false = nop {}
			}
		}
		step {
			name = "Insert switching indicator to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].can_switch"
					"true"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Insert vlan partitioning indicator to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = set_attr {
					"cmdb_ci_ip_switch[*].can_partitionvlans"
					eval {"javascript:var rtrn = '';var numberOfVlans = (${vtpVlanTable[*].vtpVlanType}.size() == 0) ? ${partitionsTable[*].ifIndex}.size() : ${vtpVlanTable[*].vtpVlanType}.size();rtrn = (numberOfVlans > 1);"}
				}
				on_false = nop {}
			}
		}
		step {
			name = "Reference and relation between dscy_swtch_partition to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = relation_reference {
					table1_name = "cmdb_ci_ip_switch"
					table2_name = "dscy_swtch_partition"
					result_table_name = "switch_partitions_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					relation_type = "Contains::Contained by"
					ref_direction = childToParent
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Reference and relation between dscy_switchport to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = relation_reference {
					table1_name = "cmdb_ci_ip_switch"
					table2_name = "dscy_switchport"
					result_table_name = "switchport_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					relation_type = "Contains::Contained by"
					ref_direction = childToParent
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Reference and relation between dscy_swtch_fwd_rule to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldRunSwitchLogic"}
					"true"
				}
				on_true = relation_reference {
					table1_name = "cmdb_ci_ip_switch"
					table2_name = "dscy_swtch_fwd_rule"
					result_table_name = "forward_table_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					relation_type = "Contains::Contained by"
					ref_direction = childToParent
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "CDP and LLDP"
			ref {refid = "ea3f48e6db692200868a7c841f9619f1"}
		}
		step {
			name = "Insert discovery_proto_id & discovery_proto_type for CDP if enabled"
			if {
				condition = all {
					is_not_empty {get_attr {"cdpGlobalDeviceId"}}
					eq {
						get_attr {"shouldDiscoverL2CacheProtocols"}
						"true"
					}
				}
				on_true = transform {
					src_table_name = "cmdb_ci_ip_switch"
					target_table_name = "cmdb_ci_ip_switch"
					operation {
						set_field {
							field_name = "discovery_proto_id"
							value = concat {
								get_attr {"cdpGlobalDeviceId"}
								":"
								get_attr {"lldpLocSysName"}
							}
						}
						set_field {
							field_name = "discovery_proto_type"
							value = "CDP"
						}
					}
				}
				on_false = nop {}
			}
		}
		step {
			name = "Insert discovery_proto_id & discovery_proto_type for CDP if enabled"
			if {
				condition = all {
					is_not_empty {get_attr {"lldpLocSysName"}}
					eq {
						get_attr {"shouldDiscoverL2CacheProtocols"}
						"true"
					}
					is_empty {get_attr {"cdpGlobalDeviceId"}}
				}
				on_true = transform {
					src_table_name = "cmdb_ci_ip_switch"
					target_table_name = "cmdb_ci_ip_switch"
					operation {
						set_field {
							field_name = "discovery_proto_id"
							value = get_attr {"lldpLocSysName"}
						}
						set_field {
							field_name = "discovery_proto_type"
							value = "LLDP"
						}
					}
				}
				on_false = nop {}
			}
		}
		step {
			name = "SNMP - Switch - Vlan"
			ref {refid = "fc811e29db352200868a7c841f961951"}
		}
		step {
			name = "Reference between discovery_switch_fwd_table to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldBlockSwitchExploration"}
					"false"
				}
				on_true = relation_reference {
					table1_name = "discovery_switch_fwd_table"
					table2_name = "cmdb_ci_ip_switch"
					result_table_name = "fwd_table_ip_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					ref_direction = parentToChild
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Reference between discovery_switch_bridge_port_table to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldBlockSwitchExploration"}
					"false"
				}
				on_true = relation_reference {
					table1_name = "discovery_switch_bridge_port_table"
					table2_name = "cmdb_ci_ip_switch"
					result_table_name = "bridge_port_ip_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					ref_direction = parentToChild
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Reference between discovery_switch_spanning_tree_table to cmdb_ci_ip_switch"
			if {
				condition = eq {
					get_attr {"shouldBlockSwitchExploration"}
					"false"
				}
				on_true = relation_reference {
					table1_name = "discovery_switch_spanning_tree_table"
					table2_name = "cmdb_ci_ip_switch"
					result_table_name = "stp_ip_switch"
					unmatched_lines = remove
					condition = eq {
						"1"
						"1"
					}
					ref_direction = parentToChild
					ref_field_name = "cmdb_ci"
				}
				on_false = nop {}
			}
		}
		step {
			name = "Stacked Switches"
			ref {refid = "3cc3da63db71d3406ec43220ad96197a"}
		}
	}
}
