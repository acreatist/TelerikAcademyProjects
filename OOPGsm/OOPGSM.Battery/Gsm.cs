using System;
using System.Collections.Generic;
using System.Text;

namespace OOPGSM.Common
{
	public class Gsm
	{
		private string model;
		private string manifacture;
		private double? price;
		private string owner;
        private List<Call> callHistory = new List<Call>();

        public List<Call> CallHistory
        {
            get { return callHistory; }
            set { callHistory = value; }
        }

        private int callHistoryLength;

		public Display display = new Display();
		public Battery battery = new Battery();

		public string Model {
			get { return this.model; }
			set { this.model = value; }
		}

		public string Manifacture
		{
			get { return this.manifacture; }
			set { this.manifacture = value; }
		}

		public double? Price
		{
			get { return this.price; }
			set {
				if (value < 0)
				{
					throw new ArgumentOutOfRangeException("Price", "Price cannot be negative");
				}
				this.price = value; 
			}
		}

		public string Owner
		{
			get { return this.owner; }
			set { this.owner = value; }
		}

		public Gsm()
		{
			this.model = null;
			this.manifacture = null;
			this.owner = null;
			this.price = 0.0;

			this.display = new Display();
			this.battery = new Battery();
		}
        
		// Call history list indexer
        public int CallHistoryLength
        {
            get { return this.callHistory.Count; }            
        }

        // Call history indexer
        public Call this[int index]
        {
            get
            {
                return callHistory[index];
            }

            set
            {
                callHistory[index] = value;
            }
        }

		public Gsm(string model, string manifacturer, string owner = null, double? price = null, Battery battery = null, Display display = null)
		{
			this.model = model;
			this.manifacture = manifacturer;
			this.owner = owner;
			this.price = price;

			if (battery != null)
			{
				this.display = display;	
			}
			else
			{
				this.display = new Display();
			}

			if (battery != null)
			{
				this.battery = battery;
			}
			else
			{
				this.battery = new Battery();
			}
			
		}

		public override string ToString()
		{
			return String.Format("GSM Manifacturer: {0} \nGSM Model: {1} \nGSM Price: {2} \n\nOwner: {3} \n\nBattery Model: {4} \nBattery Idle Time: {5} \nBattery Talk Time: {6} \nDisplay Size (in inches): {7} \nDisplay Color Depth: {8}",
				this.manifacture, this.model, this.price, this.owner, this.battery.Model, this.battery.HoursIdle, this.battery.HoursTalk, this.display.SizeInches, this.display.ColorDepth);
		}

        /* ----------------------
         * IPHONE GSM DEFINITION
         * -------------------- */
		static Battery iphone4SBatt = new Battery(0.0, 0.0, "a1175");
		static Display iphone4SDisplay = new Display(3.5, 16);
		private static Gsm iphone4s = new Gsm("iPhone 4S", "Apple", null, 1200.00, iphone4SBatt, iphone4SDisplay);

		public static Gsm IPhone4S
		{
			get { return iphone4s; }
		}

        /* ---------------------
         * CALL HISTORY METHODS
         * --------------------- */

        /* Add a call to history */
		public void AddCallToHistory(Call callMade)
		{	
			this.callHistory.Add(callMade);
		}

        /* Delete a call from history for a given index */
        public void DeleteFromHistory(int callIndex)
        {
            this.callHistory.RemoveAt(callIndex);
        }

        /* print all calls history */
        public void PrintCallHistory()
        {
            foreach (var call in this.callHistory)
            {
                Console.WriteLine("{0} {1}, {2} {3}", call.CallDate, call.CallTime, call.DialNumber, call.CallDuration);
            }
        }

        /* return total calls price, by given price per minute */
        public double CallHistoryTotalPrice(double callPriceMinute)
        {
            double totalCallPrice = 0.0;
            
            foreach (var call in this.callHistory)
            {
                if (call.CallDuration != null)
                {
                    /* move call duration in minutes to call duration in seconds */
                    double callDurSecondsPart = (double)call.CallDuration - Math.Truncate((double)call.CallDuration);
                    double callDurationInSeconds = Math.Truncate((double)call.CallDuration) * 60 + callDurSecondsPart;

                    /* we calculate the price for a secound */
                    double priceForSecond = callPriceMinute / 60;

                    totalCallPrice += priceForSecond * (double)callDurationInSeconds;
                }
            }
            return totalCallPrice;
        }

        /* Clear call history */
        public void ClearHistory() 
        {
            this.callHistory.Clear();
        }
	}
}
