using System;
using System.Collections.Generic;
using System.Text;
using OOPGSM.Common;

namespace OOPGSM.GSMTest
{
	class GSMTest
	{
		static void Main(string[] args)
		{
            Console.WriteLine("Test GSM class with two objects:");
            Console.WriteLine(new string('-', 80));
			Gsm[] gsmTest = new Gsm[2];

			for (int i = 0; i < gsmTest.Length; i++)
			{
                Battery batt = new Battery(1.0 + i, 1.0 + i, "Batt Model " + i, BattType.liIon);
                Display disp = new Display(1.3 + i, 16);
				gsmTest[i] = new Gsm("Model " + i, "Manifacturer " + i, "Owner "+ i, 12.32 + i, batt, disp);
			}

			foreach (var gsmModel in gsmTest)
			{
				Console.WriteLine(gsmModel.ToString());
				Console.WriteLine(new string('-', 80));
			}
            Console.WriteLine();
            Console.WriteLine("Test the IPHONE object, defined in GSM Class: ");
			Console.WriteLine("Iphone: \n{0}", Gsm.IPhone4S);
		}
	}
}
