/*
  Warnings:

  - Added the required column `atualizadoEm` to the `RegistroConteudo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegistroConteudo" (
    "requestId" TEXT NOT NULL PRIMARY KEY,
    "anoLetivoId" TEXT NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "assuntoId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "solicitacao" JSONB NOT NULL,
    "resultado" JSONB,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "RegistroConteudo_anoLetivoId_fkey" FOREIGN KEY ("anoLetivoId") REFERENCES "AnoLetivo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistroConteudo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistroConteudo_assuntoId_fkey" FOREIGN KEY ("assuntoId") REFERENCES "Assunto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RegistroConteudo" ("anoLetivoId", "assuntoId", "criadoEm", "disciplinaId", "requestId", "resultado", "solicitacao", "status") SELECT "anoLetivoId", "assuntoId", "criadoEm", "disciplinaId", "requestId", "resultado", "solicitacao", "status" FROM "RegistroConteudo";
DROP TABLE "RegistroConteudo";
ALTER TABLE "new_RegistroConteudo" RENAME TO "RegistroConteudo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
