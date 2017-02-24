s3:
	s3cmd sync --acl-public --delete-removed --exclude-from .s3ignore ./ s3://tabelas.alhur.es/
