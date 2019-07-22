﻿//-----------------------------------------------------------------------
// <copyright file="UpDateInterventoCommandHandler.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.UpDateStatoRichiesta
{
    public class UpDateStatoRichiestaCommandHandler : ICommandHandler<UpDateStatoRichiestaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _UpDateRichiestaAssistenza;
        private readonly IGetRichiestaById _getRichiestaById;

        public UpDateStatoRichiestaCommandHandler(
            IUpDateRichiestaAssistenza UpDateRichiestaAssistenza,
            IGetRichiestaById GetRichiestaById)
        {
            this._UpDateRichiestaAssistenza = UpDateRichiestaAssistenza;
            this._getRichiestaById = GetRichiestaById;
        }

        public void Handle(UpDateStatoRichiestaCommand command)
        {
            RichiestaAssistenza richiesta = _getRichiestaById.Get(command.IdRichiesta);

            if (command.StatoRichiesta.Equals("Chiusa") || command.StatoRichiesta.Equals("Sospesa"))
            {
                foreach (var composizione in richiesta.Partenze)
                {
                    if (!composizione.Partenza.Mezzo.Stato.Equals("In Rientro") && !composizione.Partenza.Mezzo.Stato.Equals("In Sede"))
                    {
                        composizione.Partenza.Mezzo.Stato = "In Rientro";
                    }
                }
            }

            richiesta.SincronizzaStatoRichiesta(command.StatoRichiesta, richiesta.StatoRichiesta, command.IdOperatore, command.Note);

            this._UpDateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
