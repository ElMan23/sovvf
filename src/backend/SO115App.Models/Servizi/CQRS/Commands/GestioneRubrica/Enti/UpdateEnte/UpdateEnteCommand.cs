﻿using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteCommand
    {
        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
        public EnteIntervenuto Ente { get; set; }
    }
}
