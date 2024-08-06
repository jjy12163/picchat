"""Add cascade delete to FaceImage, Chatbot

Revision ID: 593aca17ade7
Revises: 33951703d4c1
Create Date: 2024-08-06 06:34:39.993291

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '593aca17ade7'
down_revision = '33951703d4c1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('faceimage', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=mysql.MEDIUMBLOB(),
               type_=sa.LargeBinary(length=16777215),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('faceimage', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.LargeBinary(length=16777215),
               type_=mysql.MEDIUMBLOB(),
               existing_nullable=True)

    # ### end Alembic commands ###
