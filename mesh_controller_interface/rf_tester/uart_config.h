/** @file uart_config.h
 *
 * @author Wassim FILALI
 * 
 *
 *
 * $Date: 12.11.2016
 * $Revision:
 *
 */
#ifndef _UART_CONFIG_
#define _UART_CONFIG_

//UART_BAUD_RATE possible values 115200 9600
#define UART_BAUD_RATE 115200

//----------------------------------- Interruptions ---------------------------------------
//Flag: UART_USE_RX_INETRRUPT
// 1 : Enabled
// declares the IRQ and requires teh user to declare a uart_callback() function

#define UART_USE_RX_INETRRUPT 1

#if UART_USE_RX_INETRRUPT == 1
#define UART_ECHO 1
#endif
//Flag: UART_CALLBACK_POLLING
// 1 : Enabled =>   simplified to just calling uart_rx_user_poll()
//                  which will if necessary call the uart_rx_user_callback()
//                  The work behind is :
//                  'uart_rx_user_callback_pending' will be polled
//					consume 'uart_BUFFER' with 'uart_index', 
//					acknowledge with 'uart_rx_user_callback_performed'
// 0 : INTERRUPT => The 'uart_rx_user_callback()' will be called from the uart interrupt context
// Flags dependencies
// '#define UART_USE_RX_INETRRUPT 1' has to be set to 1
#define UART_CALLBACK_POLLING 0


#define UART_FRAME_SIZE 31

//the terminal sends 13
#define UART_EOL_C	13

//Flag: UART_Through_RF_Delay
//1 : Enabled this delay is added after every end of line to allow proper transmission of messages through radio
//0 : Disabled, normal behaviour
#define UART_Through_RF_Delay 0

#endif /*_UART_CONFIG_*/
