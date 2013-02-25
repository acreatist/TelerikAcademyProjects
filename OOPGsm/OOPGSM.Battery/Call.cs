using System;
using System.Collections.Generic;
using System.Text;

namespace OOPGSM.Common
{
	public class Call
	{
		private string callDate;
		private string callTime;
		private string dialNum;
		private double? duration;
		
		public string CallDate
		{
			get { return this.callDate;  }
			set { this.callDate = value; }
		}

		public string CallTime
		{
			get { return this.callTime; }
			set { this.callTime = value; }
		}

		public string DialNumber
		{
			get { return this.dialNum; }
			set { this.dialNum = value; }
		}

		public double? CallDuration
		{
			get { return this.duration; }
			set {
				// TODO: validate duration time (minutes < 60 and sec < 60)
				this.duration = value; 
			}
		}

		public Call()
		{
			this.callDate = null;
			this.callTime = null;
			this.dialNum = null;
			this.duration = null;
		}

		public Call(DateTime callTimeStamp, string callDialNum, double callDuration)
		{
			this.callDate = callTimeStamp.Date.ToShortDateString();
			this.callTime = callTimeStamp.TimeOfDay.ToString();
			this.dialNum = callDialNum;
			this.duration = callDuration;
		}


	}
}
