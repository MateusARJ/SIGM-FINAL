-- CreateTable
CREATE TABLE "AnoLetivo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "anoLetivoId" TEXT NOT NULL,
    CONSTRAINT "Disciplina_anoLetivoId_fkey" FOREIGN KEY ("anoLetivoId") REFERENCES "AnoLetivo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assunto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    CONSTRAINT "Assunto_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistroConteudo" (
    "requestId" TEXT NOT NULL PRIMARY KEY,
    "anoLetivoId" TEXT NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "assuntoId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "solicitacao" JSONB NOT NULL,
    "resultado" JSONB,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegistroConteudo_anoLetivoId_fkey" FOREIGN KEY ("anoLetivoId") REFERENCES "AnoLetivo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistroConteudo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistroConteudo_assuntoId_fkey" FOREIGN KEY ("assuntoId") REFERENCES "Assunto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
