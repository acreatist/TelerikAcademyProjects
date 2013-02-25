using System;
using System.Collections.Generic;
using System.Text;
using OOPGSM.Common;

namespace OOPGSM.CallHistoryTest
{
	class CallHistoryTest
	{
		static void Main(string[] args)
		{
            Console.WriteLine("Test call history - defining a gsm, adding 3 calls, then deleting a call and display each step.");
            Console.WriteLine(new string('-', 80));

			Gsm callTestGsm = new Gsm();
			callTestGsm.Model = "Test GSM";
			
			DateTime callTimeStamp = new DateTime();

            /* add 3 calls to call history */
			Call callMade = new Call(callTimeStamp, "+359889963852", 23.59);	
			callTestGsm.AddCallToHistory(callMade);

			callMade = new Call(callTimeStamp, "+359885687616", 13.29);
			callTestGsm.AddCallToHistory(callMade);

			callMade = new Call(callTimeStamp, "+359878963756", 3.59);
			callTestGsm.AddCallToHistory(callMade);

            /* Display Call History */
            Console.WriteLine("Display Call History");
            callTestGsm.PrintCallHistory();

            /* Calc total calls callPriceMinute */
            double callPriceMinute = 0.37;
            Console.WriteLine();
            Console.WriteLine("Display Total Calls Price (call price = {0}/minute)", callPriceMinute);

            double callTotalPrice = callTestGsm.CallHistoryTotalPrice(callPriceMinute);
            Console.WriteLine("Total calls price: {0:F2} lv.", callTotalPrice);

            /* delete a call and display call history again */
            Console.WriteLine(new string('-', 80));
            Console.WriteLine("Delete Longest Call:");

            int maxCallIndex = 0;
            for (int i = 1; i < callTestGsm.CallHistoryLength; i++)
            {
                
                if (callTestGsm[i].CallDuration > callTestGsm[maxCallIndex].CallDuration)
                {
                    maxCallIndex = i;
                }
            }

            callTestGsm.DeleteFromHistory(maxCallIndex);
            Console.WriteLine("Display Call History, after deleted longest call");
            callTestGsm.PrintCallHistory();
            callTotalPrice = callTestGsm.CallHistoryTotalPrice(callPriceMinute);
            Console.WriteLine("Total calls price: {0:F2} lv.", callTotalPrice);

            /* Clear Call History */
            Console.WriteLine(new string('-', 80));
            
            callTestGsm.ClearHistory();
            Console.WriteLine("Clear Call History");
            callTestGsm.PrintCallHistory();

		}
	}
}
